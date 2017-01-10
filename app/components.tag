require('./style.scss')
navbar
	nav.navbar.navbar-default.navbar-fixed-top
		.container
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

content-page
	.container
		.page
			#{'yield'}
	style.

res
	div
		div
			| { opts.num }:{ opts.from } [{ opts.mail }] { opts.date } ID:{ opts.id }
		div.res
			| { opts.content }
		hr

	style(scoped).
		.res{
			margin-left:10px;
		}


bbs-form
	div.container
		form(method='POST', action='/test/bbs.cgi' accept-charset='Shift_JIS').form-horizonal
			input(type='hidden', name='bbs', value='{ opts.bbs }')
			input(type='hidden', name='key', value='{ opts.key }', if='{ opts.newthread!=="true" }')
			div(if='{ opts.newthread==="true" }').form-group
				label.control-label.col-sm-2 タイトル:
				div.col-sm-10
					input(type='text', name='subject').form-control
			div.form-group
				label.control-label.col-sm-2 名前:
				div.col-sm-10
					input(type='text', name='FROM').form-control
			div.form-group
				label.control-label.col-sm-2 E-mail:
				div.col-sm-10
					input(type='text', name='mail').form-control
			div.form-group
				textarea(name='MESSAGE').form-control
				button(type='submit').btn 書き込む

	script.
		var is_newthread=opts.newthread==='true'
		var is_threadpost=opts.newthread!=='true'

	style(scoped).
		.col-sm-10{
			padding-bottom:10px;
		}
