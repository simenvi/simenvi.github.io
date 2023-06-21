function updateDate() {
	document.getElementById('updatedate').innerHTML = "2023-06-09";
}

function updateDateE() {
  document.getElementById('updatedate').innerHTML = "June 9, 2023";
}

function openURL(title, url) {
      window.open(url, "_blank");
}

function openURL_e(title, url) {
        window.open(url, "_blank");
}

function openURLm(title, url) {
  let msg = (title !== undefined) ? "另開新視窗，連結 「" + title + "」？" : "您即將離開本網站，繼續前往連結頁嗎?";
  let yesno = confirm(msg);
  if (yesno == true) {
      window.open(url, "_blank");
  }
}

function openURLm_e(title, url) {
    let msg = (title !== undefined) ? "To open in a new tab, then open a link '" +
        title + "' on a web page ?" : "You are going to leave this website. Continue with ?";
    let yesno = confirm(msg);
    if (yesno == true) {
        window.open(url, "_blank");
    }
}