



<!-- #include virtual="hello.js" -->

<ul>
<% for i in item %>
	<li><% if $index > 2 %>
		<%# i %>
	<% end %></li>
<% end %>
</ul>

<ul>
{{for i in item}}
	<li>@{if $index > 2}
		{{i}}
	<% end %></li>
<% end %>
</ul>



