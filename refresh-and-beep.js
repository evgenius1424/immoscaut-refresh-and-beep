async function checkForNewIDs() {
    console.log("Running checkForNewIDs...");

    const idsOnPage = [...document.querySelectorAll(".result-list__listing")].map(e => e.getAttribute("data-id"));

    const storedIDs = JSON.parse(localStorage.getItem("storedIDs")) || [];

    const newIDs = idsOnPage.filter(id => !storedIDs.includes(id));

    if (newIDs.length > 0) {
        console.log("New IDs found. Playing a beep sound...");
        await playBeep(200);
        storedIDs.push(...newIDs);
        localStorage.setItem("storedIDs", JSON.stringify(storedIDs));
    } else {
        console.log("No new IDs found.");
    }
}

async function playBeep(duration) {
    console.log("Playing beep sound...");
    return new Promise((resolve, reject) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.connect(audioContext.destination);

        oscillator.start();

        setTimeout(() => {
            console.log("Beep sound stopped.");
            oscillator.stop();
            resolve();
        }, duration);
    });
}
async function refreshPageRandomly(minDelaySeconds, maxDelaySeconds) {
    const minDelay = minDelaySeconds * 1000;
    const maxDelay = maxDelaySeconds * 1000;

    const refreshDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    const nextFireTime = new Date(Date.now() + refreshDelay).toLocaleTimeString();

    console.log("Refreshing the page randomly...");
    console.log(`Next refresh will occur at: ${nextFireTime}`);

    await new Promise(resolve => setTimeout(resolve, refreshDelay));
    console.log("Reloading the page...");
    location.reload();
}

async function main() {
    await new Promise(resolve => setTimeout(resolve, 5000));

    if (document.title.startsWith("Wohnung mieten")) {
        console.log("Checking IDs after the page is loaded...");
        await checkForNewIDs();
        await refreshPageRandomly(60, 180);
    } else if (document.title === 'Ich bin kein Roboter - ImmobilienScout24') {
        console.log("Captcha page displayed. Playing a long beep sound...");
        await playBeep(600);
    }
}

main();
