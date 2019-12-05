function showChart(location, element){
  var chart_frame = document.getElementById(element);
  chart_frame.src = "/chart?loc=" + location;
  console.log("show");
}
