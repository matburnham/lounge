{{> ../user_name nick=from}}
has kicked
{{> ../user_name nick=target}}
{{#if text}}
	<i class="part-reason">({{{parse text}}})</i>
{{/if}}
