import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from 'react-router-dom';
import './light.css';
import Logo from './logo.svg';
import { Container, Divider, Dropdown, Form, Grid, Header, Icon, Image, Menu, Message, Segment, Table } from 'semantic-ui-react';
import { requester } from './utils.js';
import { Home } from './Home.js';
import { Transactions, TransactionDetail } from './Transactions.js';
import { Cards } from './Cards.js';
import { NotFound, PleaseLogin } from './Misc.js';

function App() {
	const [token, setToken] = useState(localStorage.getItem('token', ''));
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user', 'false')));

	function setTokenCache(x) {
		setToken(x);
		localStorage.setItem('token', x);
	}

	function setUserCache(x) {
		setUser(x);
		localStorage.setItem('user', JSON.stringify(x));
	}

	useEffect(() => {
		requester('/me/', 'GET', token)
		.then(res => {
			console.log(res);
			setUserCache(res);
		})
		.catch(err => {
			console.log(err);
			setUser(false);
		});
	}, [token]);

	function logout() {
		window.location = '/';
		setTokenCache('');
		setUserCache(false);
	}

	let menuName = user && user.member && user.member.preferred_name || 'Profile';
	menuName = menuName.length > 7 ? 'Profile' : menuName;

	return (
		<Router>
			<Container>
				<div className='header'>
					<img src={Logo} className='logo' />
				</div>
			</Container>

			<Menu>
				<Container>
					<Menu.Item
						content='Home'
						as={Link}
						to='/'
					/>

					<Dropdown item text={menuName} id='ps-menu'>
						<Dropdown.Menu>
							<Dropdown.Item
								content='Transactions'
								as={Link}
								to='/transactions'
							/>
							<Dropdown.Item
								content='Cards'
								as={Link}
								to='/cards'
							/>
						</Dropdown.Menu>
					</Dropdown>

					<Dropdown item text='Space' id='ps-menu'>
						<Dropdown.Menu>
							<Dropdown.Item
								content='Members'
							/>
							<Dropdown.Item
								content='Courses'
							/>
						</Dropdown.Menu>
					</Dropdown>

					{user && <Menu.Menu position='right'>
						<Menu.Item
							content='Logout'
							onClick={logout}
							icon='cancel'
						/>
						<Menu.Item fitted content='' />
					</Menu.Menu>}
				</Container>
			</Menu>

			<Route exact path='/'>
				<Home token={token} setTokenCache={setTokenCache} user={user} setUserCache={setUserCache} />
			</Route>

			<div className='topPadding'>
				{user ?
					<Switch>
						<Route path='/transactions/:id'>
							<TransactionDetail user={user} />
						</Route>
						<Route path='/transactions'>
							<Transactions user={user} />
						</Route>

						<Route path='/cards'>
							<Cards user={user} />
						</Route>

						<Route path='/:page'>
							<NotFound />
						</Route>
					</Switch>
				:
					<Route path='/:page'>
						<PleaseLogin />
					</Route>
				}
			</div>

		</Router>
	)
};

export default App;
