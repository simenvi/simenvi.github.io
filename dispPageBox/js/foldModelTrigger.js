var triggerText = sessionStorage.getItem('foldModel'); 
$(document).ready(function() {
  // To Open Fold Modal
  window.scrollTo(0,0); // Scroll to TOP of Window
  triggerText = (triggerText == null || triggerText === undefined) ? 5 : triggerText;
  // 每隔5次開啟首頁就彈跳資訊視窗
  if((triggerText % 5) == 0)  { 
    myBillboard();
  }
  sessionStorage.setItem('foldModel', parseInt(triggerText) + 1); 
});

function myBillboard() {
  const windowFeatures = "height=600,width=800,left=600,top=100,scrollbars=yes,resizable=yes";
  
  // if (confirm("行政院環境保護署「同舟共濟-台灣氣候變遷調適平台」\n本網站「使用調查問卷」，請撥冗填寫！\n（點擊〔確定〕即可連結填寫）")) {
  //   const handle = window.open(
  //     "https://docs.google.com/forms/d/e/1FAIpQLSfn9D78wenm4Bhh-hIjrNM6VUashsE3UPMhm99I2UZs9sh-oQ/viewform",
  //     "mozillaWindow",
  //     windowFeatures
  //   );      
  // }
  
  if (confirm("政府推動國家氣候變遷調適行動計畫  針對易受氣候變遷衝擊領域行動方案內容舉辦公聽會。  歡迎公民團體一同參與、提出想法。")) {
    const handle = window.open("./TCCIP-1-G/TCCIP-1-G11-0.html","_self");      
  }  
}