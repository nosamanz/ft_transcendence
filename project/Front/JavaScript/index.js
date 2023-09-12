
const redirectButton = document.getElementById('42');

 redirectButton.addEventListener('click', () => {
   window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-1f2410ba3886eb4fffb4504867eb5932cf2c822199a8e574ec4f6c3ab43f1104&redirect_uri=http%3A%2F%2F10.12.14.1%3A80%2Fauth%2F42%2Fgetcode&response_type=code';
});

function hiddenLogin()
{
	var loginContainer = document.getElementById("login");
	loginContainer.classList.add("pasive");
}
