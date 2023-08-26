
	const redirectButton = document.getElementById('42');

    redirectButton.addEventListener('click', () => {
      window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e7bed2aab0541a9726ad7abcc0023e254fe1c3b64bfab299d2d2a395b625a545&redirect_uri=http%3A%2F%2F10.12.14.1%3A80%2Fauth%2Fgetcode&response_type=code';
    });

function hiddenLogin()
{
	var loginContainer = document.getElementById("login");
	loginContainer.classList.add("pasive");
}
