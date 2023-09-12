type PropsType = {
	login: boolean,
	setViewCart: React.Dispatch<React.SetStateAction<boolean>>,
}

const Navbar = ({login, setViewCart}:PropsType) => {
	const button = login
	? <button onClick={() => setViewCart(false)}></button>
	: <button onClick={() => setViewCart(true)}>Login</button>
	const content = (
        <nav className="nav">
            <a className="navigation-a" href="#home">Oyun</a>
            <a className="navigation-a"href="#leaderboard">Leaderboard</a>
            <a className="navigation-a"href="#profil">Profil</a>
            {button}
        </nav>
    )
	return content;
};
export default Navbar;
