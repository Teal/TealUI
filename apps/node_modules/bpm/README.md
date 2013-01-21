bpm
===

bpm (BootJs Package Manager) is a build tool for front-end projects built by Node.Js.

## What to build for?

1. Compress css/js files.
2. Rewrite the url of assets. e.g. Rewrite to cdn path:

before build:
	
	<script src="../assets/page.js"></script>
	
after build:

	<script src="http://cdn.domain.com/assets/page.js"></script>
	
3. Remove the include() to improve performance.

4. Any other requirements such as custom code compiling.