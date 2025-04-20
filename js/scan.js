var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
});

var alertList = document.querySelectorAll('.alert')
alertList.forEach(function (alert) {
    new bootstrap.Alert(alert)
});

// GETTING ALL VARIABLES AND INPUTS

var requests = document.getElementById("requests");
var maxTrack = document.getElementById("max-track");
var headPosition = document.getElementById("head");
var tracks = document.getElementById("tracks");
var run = document.getElementById("run");
run.classList.toggle("disabled");
var dir = document.getElementById("direction");
var yrange = 0, head = 0, xrange = 0;
var xlabel = [], ylabel=[];
var fisrtTime = true;
var trackRequests;


//FUNCITON THAT RETURNS THE SCAN ARRAY

function scan(trequests, headpos, direction, max){
    let tr = trequests; 
    var requestorder = [];
    let i = 0;
    
    if(tr.indexOf(headpos)!==-1){
        tr.splice(tr.indexOf(headpos), 1);
        yrange -=1;
    }

    if(direction==="right"){
        if(tr.indexOf(max)===-1){
            tr.push(max);
            yrange+=1;
        }
        tr.sort(function(b,c) {
            return b - c
        });

        let startindex;
        for(i=0; i<yrange; i++){
            if(tr[i]>headpos){
                startindex = i;
                break;
            }
        }
        for(i=startindex; i<yrange; i++){
            requestorder.push(tr[i]);
        }
        for(i=startindex-1; i>-1; i--){
            requestorder.push(tr[i]);
        }
    }
    else if(direction==="left"){
        if(tr.indexOf(0)===-1){
            tr.push(0);
            yrange+=1;
        }
        tr.sort(function(b,c) {
            return b - c
        });

        let startindex;
        for(i=0; i<yrange; i++){
            if(tr[i]>headpos){
                startindex = i-1;
                break;
            }
        }
        for(i=startindex; i>-1; i--){
            requestorder.push(tr[i]);
        }
        for(i=startindex+1; i<yrange; i++){
            requestorder.push(tr[i]);
        }
    }
    return requestorder;
}

// FUCNTION TO CALCULATE SEEK OPERATIONS

function seekOperations(requestorder, headpos){
    var seektime = 0 ;
    seektime += Math.abs(headpos - requestorder[0]);
    for(var i=0;i<requestorder.length-1;i++){
        seektime += Math.abs(requestorder[i+1] - requestorder[i]);  
    }
    return seektime;
}

function seekOperationsCalculations(requestorder, headpos){
    var calc = '';
    for(let i=0; i<requestorder.length; i++){
        if(i===0){
            calc += '|'+headpos+'-'+requestorder[i]+'|';
        }
        else{
            calc += ' + '+'|'+requestorder[i-1]+'-'+requestorder[i]+'|';
        }
    }
    return calc;
}

function execute() {

    document.getElementById("alert-wrapper").innerHTML = ``;

    let allOk = true;
    var str = '';
    if (requests.value === '') {
        str = 'Number of requests cannot be left blank!';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }
    if (Number(requests.value) <= 0 && allOk) {
        str = 'The number of request should be greater than 0!';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }
    if (maxTrack.value === '' && allOk) {
        str = 'Maximum number of tracks cannot be left blank!';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }
    if (Number(maxTrack.value) <= 0 && allOk) {
        str = 'Maximum number of tracks should be greater than 0!';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }
    if (headPosition.value === '' && allOk) {
        str = 'The starting head position needs to be mentioned! It cannot be left blank.'
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }
    if ((Number(headPosition.value) < 0 || Number(headPosition.value) > Number(maxTrack.value)) && allOk) {
        str = 'The starting head position of must lie between 0 and maximum track number.';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }

    trackRequests = [];
    if ((tracks.value.split('')).indexOf(',') === -1) {
        trackRequests = (tracks.value.split(' ')).map(Number);
    }
    else {
        trackRequests = (tracks.value.split(',')).map(Number);
    }
    
    trackRequests.forEach((x) => {
        if (x < 0 || x > Number(maxTrack.value) && allOk) {
            str = 'All the track requests must lie between 0 and maximum track number.';
            document.getElementById("alert-wrapper").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
                <strong>Warning!</strong> ${str}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
            allOk = false;
        }
    });

    if(trackRequests.length != Number(requests.value) && allOk){
        str = 'Please make sure that the number of track requests in the array match the total number of requests.';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }

    if (allOk) {
        run.classList.toggle("disabled");
    
        head = Number(headPosition.value);
        xrange = Number(maxTrack.value);

        // CALLING THE REQUIRED FUNCTION FOR GETTING THE FINAL ARRAY
        trackRequests = [...new Set(trackRequests)];
        yrange = Number(trackRequests.length);
        trackRequests = scan(trackRequests, head, String(dir.value), xrange);
        yrange = Number(trackRequests.length);
        for (var i = 0; i <= xrange; i++) {
            xlabel[i] = i;
        }
        for (i = 0; i <= yrange; i++) {
            ylabel[i] = i;
        }

        // FOR PROGRESS BAR
        document.getElementById('seek').style.width = '100%';
        var progressWrapper = document.getElementById("seek");
        progressWrapper.innerHTML = 
            `<div id="progressBarContainer" class="progress animate__animated animate__backInUp">
                <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
            </div>`;
    
        document.getElementById("dImageIcon").innerHTML = `<a id="url"></a>`;
        document.getElementById("dPDFIcon").innerHTML = `<a id="genPDF"></a>`; 
        document.getElementById("download-buttons").style.display = 'none';

        var progressBar = document.getElementById("progressBar");
        var progressBarContainer = document.getElementById("progressBarContainer");

        function displaySeekOp(){
            let temp = document.getElementById('temp');
            let temp1 = document.getElementById('temp1');
            temp.remove(); temp1.remove();

            let url = document.getElementById("url");
            url.remove();

            let genPDF = document.getElementById("genPDF");
            genPDF.remove();

            document.getElementById('seek').style.width = 'fit-content'; // to be added to other js files
            // document.getElementById('seek').style.flexDirection = 'column';
            var seekOp1 = document.createElement('h4');
            seekOp1.id = 'temp';
            seekOp1.style.fontWeight = "700"; seekOp1.style.margin = "5px";
            str = 'Total Seek Time: ' + seekOperations(trackRequests, head) + ' ms';
            seekOp1.append(document.createTextNode(str));
            seekOp1.classList.add("animate__animated"); seekOp1.classList.add("animate__backInUp");
            document.getElementById('seek').append(seekOp1);

            var seekOp2 = document.createElement('h4');
            seekOp2.id = 'temp1';
            seekOp2.style.fontWeight = "700"; seekOp2.style.margin = "5px";
            str = 'Average Seek Time: ' + Math.round((xrange/3)*100)/100 + ' ms';
            seekOp2.append(document.createTextNode(str));
            seekOp2.classList.add("animate__animated"); seekOp2.classList.add("animate__backInUp");
            document.getElementById('seek').append(seekOp2);

            setTimeout(() => {
                window.scrollTo(0,document.body.scrollHeight);
            }, 700);
        }

        var a = 0;
        var incrementValue = 100/yrange, counter=0;
        var updatingData = setInterval(pushData, 700);
        function pushData(){
            if(a<yrange){
                a = a+1;

                counter+=incrementValue;
                progressBar.style.width = counter+"%"
            }
            else{
                clearInterval(updatingData);
                progressBarContainer.classList.toggle("animate__backOutDown");
                setTimeout(function () {
                    progressBarContainer.style.display = "none";
                    progressWrapper.innerHTML = `<h4 id="temp"> </h4> <h4 id="temp1"> </h4>`;
                    run.classList.toggle("disabled");
                    displaySeekOp();
                }, 1000
                );
            }
        }
    }
}
run.addEventListener("click", execute);

window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
        document.getElementsByClassName('navbar')[0].classList.add('animate__slideOutUp');
        setTimeout(() => {
            document.getElementsByClassName('navbar')[0].style.display = 'none';

            document.getElementsByClassName('navbar')[0].classList.remove('animate__slideOutUp');
        }, 100);
    }
    else {
        if (document.getElementsByClassName('navbar')[0].style.display === 'none') {
            document.getElementsByClassName('navbar')[0].classList.add('animate__slideInDown');
            setTimeout(() => {
                document.getElementsByClassName('navbar')[0].style.display = 'block';
            }, 50);
            setTimeout(() => {
                document.getElementsByClassName('navbar')[0].classList.remove('animate__slideInDown');
            }, 500);
        }

    }
});