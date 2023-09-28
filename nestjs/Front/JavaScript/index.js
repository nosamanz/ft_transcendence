
const redirectButton = document.getElementById('42');

 redirectButton.addEventListener('click', () => {
   window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-49c00e638b92e23cd3e1a9e499e18c4f0187c30258c088afa3788a9d97129c66&redirect_uri=http%3A%2F%2F10.12.14.1%3A80%2Fauth%2F42%2Fgetcode&response_type=code';
});

function hiddenLogin()
{
	var loginContainer = document.getElementById("login");
	loginContainer.classList.add("pasive");
}
//curl http://10.12.14.1:80/avatar/upload -F 'file=@./default.jpeg' -F 'name=test' -F 'gel=ali' -H "authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk4OTUxLCJpYXQiOjEzMzM0MTUwODc2fQ.O5pJAZCwSgDnErj5MRZpMMEIOgwgDHNXFaYCwwJqExw"
//curl -X POST http://10.12.14.1:80/avatar/upload -F 'file=@./default.jpeg'  -H "authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk4OTUxLCJpYXQiOjEzMzM0MTUwODc2fQ.O5pJAZCwSgDnErj5MRZpMMEIOgwgDHNXFaYCwwJqExw"
