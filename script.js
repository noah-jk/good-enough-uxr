$(document).ready(function () {

    // --- Config ---
    // Edit this array to change the tasks shown to the participant.
    let tasks = [
        "Find the computer science program",
        "Locate the primary address",
        "Locate the counseling page"
    ];

    // --- State ---
    const iframeStartUrl = $("#test-iframe").attr("src");
    let currentTaskIndex = 0; // which task is currently active
    let results = [];         // accumulated { task, rating, duration } for each completed/skipped task
    let taskStart = null;     // timestamp (ms) when the current task began
    let taskDuration = null;  // elapsed seconds for the most recently stopped task
    let umuxRatings = { q1: null, q2: null }; // UMUX-Lite responses (1–7 each)

    // --- Timer ---

    // Called when a new task is displayed; marks the start time.
    function startTimer() {
        taskStart = Date.now();
    }

    // Called when the participant signals completion or skips.
    // Captures elapsed seconds and clears the start timestamp.
    // Timer stops here so time in the rating popup isn't counted.
    function stopTimer() {
        taskDuration = Math.round((Date.now() - taskStart) / 1000);
        taskStart = null;
    }

    // Formats a raw second count into m:ss (e.g. 75 → "1:15").
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m + ':' + String(s).padStart(2, '0');
    }

    // --- Task flow ---

    // Advances to the next task, or triggers the UMUX survey when all tasks are done.
    function showTask() {
        if (currentTaskIndex >= tasks.length) {
            showUmux();
            return;
        }
        $("#task-text").text(tasks[currentTaskIndex]);
        startTimer();
    }

    // Hides the testing area and shows the UMUX-Lite survey screen.
    function showUmux() {
        $("#testing-area").hide();
        $("#umux-screen").removeClass("hidden");
    }

    // Maps a SEQ rating (1–7 or "Skipped") to a CSS badge modifier class.
    // Score ranges: 1–2 = low, 3–4 = mid, 5–7 = high.
    function getBadgeClass(rating) {
        if (rating === "Skipped") return "summary-badge--skipped";
        const score = parseInt(rating);
        if (score <= 2) return "summary-badge--low";
        if (score <= 4) return "summary-badge--mid";
        return "summary-badge--high";
    }

    // Builds and displays the end-of-session summary from the results array,
    // then appends the computed UMUX-Lite score below the task rows.
    function showSummary() {
        const $list = $("#summary-list").empty();

        results.forEach(function (r) {
            $list.append(
                $("<div>").addClass("summary-row").append(
                    $("<span>").addClass("summary-task").text(r.task),
                    $("<span>").addClass("summary-time").text(formatTime(r.duration)),
                    $("<span>").addClass("summary-badge " + getBadgeClass(r.rating)).text(r.rating)
                )
            );
        });

        // UMUX-Lite score: ((q1 + q2 - 2) / 12) × 100, rounded to nearest integer.
        const umuxScore = Math.round(((umuxRatings.q1 + umuxRatings.q2 - 2) / 12) * 100);
        $list.append(
            $("<div>").addClass("summary-divider"),
            $("<div>").addClass("summary-metric-row").append(
                $("<span>").addClass("summary-task").text("Usability Score (UMUX-Lite)"),
                $("<span>").addClass("summary-metric-value").text(umuxScore + " / 100")
            )
        );

        $("#end-screen").removeClass("hidden");
    }

    // --- Event handlers ---

    // Dismiss the intro modal and begin the first task.
    $("#start-test").click(function () {
        $("#intro-screen, #overlay").fadeOut(300);
        $("#testing-area").removeClass("hidden");
        showTask();
    });

    // Record a skipped task (no rating) and move to the next one.
    $("#skip-task").click(function () {
        stopTimer();
        results.push({ task: tasks[currentTaskIndex], rating: "Skipped", duration: taskDuration });
        currentTaskIndex++;
        showTask();
    });

    // Reset the iframe to the original start URL.
    $("#reload-iframe").click(function () {
        $("#test-iframe").attr("src", iframeStartUrl);
    });

    // Stop the task timer and show the SEQ rating popup.
    $("#task-complete").click(function () {
        stopTimer();
        $("#rating-popup").fadeIn(300);
        $("#overlay").fadeIn(300);
    });

    // Record the rating + duration, dismiss the popup, and advance to the next task.
    $(".rate-btn").click(function () {
        results.push({ task: tasks[currentTaskIndex], rating: $(this).data("rating"), duration: taskDuration });
        $("#rating-popup").fadeOut(300);
        $("#overlay").fadeOut(300);
        currentTaskIndex++;
        showTask();
    });

    // Record a UMUX-Lite response, visually select the button, and enable submit if both answered.
    $(".umux-btn").click(function () {
        const q = $(this).data("q");
        const value = parseInt($(this).data("value"));
        $(this).closest(".rate-btn-group").find(".umux-btn").removeClass("selected");
        $(this).addClass("selected");
        umuxRatings["q" + q] = value;
        if (umuxRatings.q1 !== null && umuxRatings.q2 !== null) {
            $("#umux-submit").prop("disabled", false);
        }
    });

    // Hide the UMUX screen and show the final summary.
    $("#umux-submit").click(function () {
        $("#umux-screen").addClass("hidden");
        showSummary();
    });
});
