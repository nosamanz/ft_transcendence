
	const redirectButton = document.getElementById('42');

    redirectButton.addEventListener('click', () => {
      window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-bbfbe7593d2e8d5c3878b3c32d6095c72d7e249eb711983ec73694f0f6962561&redirect_uri=http%3A%2F%2F10.12.14.1%3A5000%2F&response_type=code'; // Replace with your desired URL
    });

function hiddenLogin()
{
	var loginContainer = document.getElementById("login");
	loginContainer.classList.add("pasive");
}
