@IF EXIST "%~dp0\node\node.exe" (
  "%~dp0\node\node.exe"  "%~dp0\node\modulebuilder\server\build.js" %*
) ELSE (
  node  "%~dp0\node\modulebuilder\server\build.js" %*
)