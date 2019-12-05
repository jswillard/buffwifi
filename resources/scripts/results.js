function showChart(location){
  var chart_frame = document.getElementById('chart');
  chart_frame.src = "/chart?loc=" + location;
  console.log("show");
}
