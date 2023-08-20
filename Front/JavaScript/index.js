
function showContent() {

	var contentContainer = document.getElementById("id");
	// var id = document.getElementById("id").value;
	// var pass = document.getElementById("pass").value;
	// if (id == "esma" && pass == "123")
	// {
	// 	contentContainer.classList.add("active");
	// 	hiddenLogin();
	// }
	hiddenLogin();
	
}

function hiddenLogin()
{
	var loginContainer = document.getElementById("login");
	loginContainer.classList.add("pasive");
}

function hiddenHeader()
{
	var headerContainer = document.getElementById("first_header");

}

function showHeader()
{

}

function lines()
{
	let sizeW = Math.random() * 12;
	let e = document.createElement('div');
	e.setAttribute('class', 'circle');
	document.body.appendChild(e);

	e.style.width= 2 +sizeW+'px';
	e.style.left = Math.random() * + innerWidth + 'px';
	setTimeout(function()
	{
		document.body.removeChild(e)
	}, 5000);
}


setInterval(function()
{
	lines();
}, 1000);