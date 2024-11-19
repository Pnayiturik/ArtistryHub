function openTab(tabName) {
    const tabs = document.getElementsByClassName("auth-form");
    const buttons = document.getElementsByClassName("tab-button");

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "block";
    document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add("active");
}
