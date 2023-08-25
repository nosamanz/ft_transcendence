
	const redirectButton = document.getElementById('42');

    redirectButton.addEventListener('click', () => {
      window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-3acdd82321754495e923a9bae02a845d8a57cfc750d5c632014ee58a2d78fa53&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fgetcode&response_type=code';
    });

function hiddenLogin()
{
	var loginContainer = document.getElementById("login");
	loginContainer.classList.add("pasive");
}
