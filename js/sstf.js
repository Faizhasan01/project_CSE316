
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
});

var alertList = document.querySelectorAll('.alert')
alertList.forEach(function (alert) {
    new bootstrap.Alert(alert)
});

// GETTING ALL VARIABLES AND INPUTS

document.getElementById("chart-image").classList.toggle("show-element");
var ctx = document.getElementById("chart").getContext("2d");
var requests = document.getElementById("requests");
var maxTrack = document.getElementById("max-track");
var headPosition = document.getElementById("head");
var tracks = document.getElementById("tracks");
var run = document.getElementById("run");
run.classList.toggle("disabled");
var yrange = 0, head = 0, xrange = 0;
var xlabel = [], ylabel = [];
var fisrtTime = true;
var algoChart = new Chart(ctx, {});
var trackRequests;

// FUNCTION THAT RETURNS THE SSTF ARRAY

function sstf(trequests, headpos, n){
    var tr = trequests;
    var a=0; var requestorder = [];
    while(n != 0 ){
        var tr1=[];
        for(var i=0;i<n;i++){
            tr1[i]= Math.abs(tr[i]-headpos);
        }
        var min = Math.min(...tr1);
        var index= tr1.indexOf(min);
        headpos=tr[index];
        requestorder[a++]=tr[index];
        tr.splice(index,1);
        n--;
    }
    console.log(requestorder);
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

// FUNCTION EXECUTED ON RUN
    //to be completed


        // chart
        algoChart.destroy();
        algoChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xlabel,
                datasets: [
                    {
                        label: "Showing",
                        yAxisID: "first",
                        xAxisID: "scale",
                        fill: false,
                        borderColor: 'black',
                        pointBackgroundColor: 'rgba(168, 255, 120,1)',
                        pointHoverBackgroundColor: 'red',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        lineTension: 0.2,
                        data: []
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    fontFamily: 'Roboto Slab',
                    fontSize: 30,
                    fontColor: 'black',
                    text: 'SSTF Graph'
                },
                hover:{
                    mode: 'index',
                    axis: 'x',
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    callbacks: {

                        title: function(tooltipItem, data){
                            return 'SSTF';
                        },
                        label: function(tooltipItem, data) {
                            return 'Properties';
                        }, 
                        afterLabel: function(tooltipItem, data) {
                            let rnumber = 'Request: ' + tooltipItem.yLabel;
                            let tnumber = 'Track: ' + data.datasets[tooltipItem.datasetIndex].data[Number(tooltipItem.yLabel)].x;
                            return (
                                [
                                    rnumber,
                                    tnumber
                                ]
                            );
                        }
                    }
                },
                animation: {
                    easing: 'easeInQuad',
                },
                scales: {
                    yAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                fontFamily: 'Roboto Slab',
                                fontSize: 12,
                                fontStyle: 'bold',
                                fontColor: 'black',
                                labelString: 'REQUEST NUMBER'
                            },
                            id: 'first',
                            position: 'top',
                            ticks: {
                                reverse: true,
                                max: yrange+1,
                                min: 0,
                                stepSize: 1,
                            },
                        }
                    ],
                    xAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                fontFamily: 'Roboto Slab',
                                fontSize: 12,
                                fontStyle: 'bold',
                                fontColor: 'black',
                                labelString: 'TRACK NUMBER'
                            },
                            id: 'scale',
                            ticks: {
                                max: xrange,
                                min: 0,
                                stepSize: 1,
                            },
                            display: true,
                            position: 'top',
                        }
                    ]
                }

            }
        });
        
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

            var dIcon = document.createElement("a");
            dIcon.id = 'url'; dIcon.download = "SSTF.jpeg";
            var dButton = document.createElement("button");
            dButton.type = 'button'; dButton.className = 'dButton btn btn-outline-dark animate__animated animate__backInUp';
            dButton.style.padding = '0';
            dButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" class="bi bi-download" viewBox="0 0 16 16" style="margin: 6px;">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>`;

            dIcon.append(dButton);
            document.getElementById('dImageIcon').append(dIcon);
            
            // NEW CODE TO BE ADDED IN OTHER JS FILES 
            var pdfButton = document.createElement("button");
            pdfButton.type = 'button'; pdfButton.className = 'pdfButton btn btn-outline-dark animate__animated animate__backInUp';
            pdfButton.style.padding = '0'; pdfButton.id="genPDF"
            pdfButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" class="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16" style="margin: 6px;">
                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                </svg>`;
            document.getElementById('dPDFIcon').append(pdfButton);            
            setTimeout(() => {
                window.scrollTo(0,document.body.scrollHeight);
            }, 700);
        }


       


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
