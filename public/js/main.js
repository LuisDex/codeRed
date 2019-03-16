
var searchQuery = "";
$(".sideBtn").on("click", function(event){
  event.preventDefault();
  var sideValue = $(this).val();
  console.log(sideValue);
  var searchQuery = sessionStorage.getItem("search");

  switch(sideValue)
  {
    case "profile":
    break;
    case "youtube":
    console.log(searchQuery);
    location.replace("/youtube?search=" + searchQuery);
    break;
    case "reddit":
    break;
    case "codepen":
    break;
    case "slack":
    break;
    case "faves":
    break;
  }
});

$(".btn2").on("click", function() {
  $(".btn2").toggleClass("btnc");
  $(".side-bar").toggleClass("side");
});

$(".searchbtn").on("click", function (event) {
  event.preventDefault();
  searchQuery = $("#searchbox").val().trim();
  sessionStorage.setItem("search", searchQuery);
  location.replace("/youtube?search=" + searchQuery);
});

$(".viewBtn").on("click",function(event)
{
  event.preventDefault();
  var idVideo = $(this).val();
  console.log($(this).val());
  location.replace("/video?id=" + idVideo);
});

$(".goBack").on("click",function(event){
  event.preventDefault();
  var searchQuery = sessionStorage.getItem("search");
  location.replace("/youtube?search=" + searchQuery);
});
