console.clear();

var body = document.body;   
var modal = createModal(document.querySelector("#modal-1"));
// modal.open(); 

function createModal(container) {

    // document.body.appendChild(container);
    body.appendChild(container);
    var content = container.querySelector(".modal-content");
    var dialog = container.querySelector(".modal-dialog");
    var polygon = container.querySelector(".modal-polygon");
    var svg = container.querySelector(".modal-svg");

    var point1 = createPoint(45, 45);
    var point2 = createPoint(55, 45);
    var point3 = createPoint(55, 55);
    var point4 = createPoint(45, 55);

    var animation = new TimelineMax({
        onReverseComplete: onReverseComplete,
        onStart: onStart,
        paused: true }).

    to(point1, 0.3, {
        x: 15,
        y: 30,
        ease: Power4.easeIn },
    0).
    to(point4, 0.3, {
        x: 5,
        y: 80,
        ease: Power2.easeIn },
    "-=0.1").
    to(point1, 0.3, {
        x: 0,
        y: 0,
        ease: Power3.easeIn }).

    to(point2, 0.3, {
        x: 100,
        y: 0,
        ease: Power2.easeIn },
    "-=0.2").
    to(point3, 0.3, {
        x: 100,
        y: 100,
        ease: Power2.easeIn }).

    to(point4, 0.3, {
        x: 0,
        y: 100,
        ease: Power2.easeIn },
    "-=0.1").
    to(container, 1, {
        autoAlpha: 1 },
    0).
    to(content, 1, {
        autoAlpha: 1 });

    var modal = {
        animation: animation,
        container: container,
        content: content,
        dialog: dialog,
        isOpen: false,
        open: open,
        close: close 
    };
    
    // document.body.removeChild(container);
    body.removeChild(container);

    var isClicked = false;
    function onClick() {
        if (modal.isOpen && !isClicked) {
            isClicked = true;

            // close();
            timerStart();
            setTimeout(function(){ close(); }, 9000); // delay 10 seconds
        }
    }

    function onStart() {
        // document.body.appendChild(container);
        body.appendChild(container);
        container.addEventListener("click", onClick);
    }

    function onReverseComplete() {
        container.removeEventListener("click", onClick);
        // document.body.removeChild(container);
        body.removeChild(container);
    }

    function open() {
        modal.isOpen = true;
        animation.play().timeScale(2);
        // document.body.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
    }

    function close() {
        modal.isOpen = false;
        animation.reverse().timeScale(2.5);
        // document.body.style.overflow = "visible";
        body.style.overflow = "visible";
    }

    function createPoint(x, y) {
        var point = polygon.points.appendItem(svg.createSVGPoint());
        point.x = x || 0;
        point.y = y || 0;
        return point;
    }

    return modal;
}

function timerStart(){
    //   按下 start 後 id 為 timer 的 DIV 內容可以開始倒數到到 0。 
        var timer = document.querySelector("#timer");
        timer.style.display = "block";
        // timer.style.border = "block";

        var number = 10;
        timer.innerText = "10 秒後關閉視窗";
        setInterval(function(){
            number -- ;
            if(number <= 0)
                number = 0;
            timer.innerText = "0" + number + " 秒後關閉視窗"}, 1000);
}