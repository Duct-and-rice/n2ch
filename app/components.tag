require('./style.scss')
navbar
	nav.navbar.navbar-default.navbar-fixed-top
		div.container
			a.navbar-brand { opts.brand }
			ul.nav.navbar-nav
				#{'yield'}


	style.
		.brand-logo{margin-left:10px;}

jumbotron
	div.jumbotron
		h1 { opts.title }
		p
			#{'yield'}

content-page-header
	.container
		.page-header
			#{'yield'}
	style.
