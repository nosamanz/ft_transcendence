
function showContent(e) {
	e.preventDefault();
	alert("hi");
	return("dasdas");
	var contentContainer = document.getElementById("home");
	var id = document.getElementById("id").value;
	var pass = document.getElementById("pass").value;
	if (id == "esma" && pass == "123")
	{
		contentContainer.classList.add("active");
		hiddenLogin();
	}

	
}

function hiddenLogin()
{
	var loginContainer = document.getElementById("login");
	loginContainer.classList.add("pasive");
}