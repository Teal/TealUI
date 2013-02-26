@IF EXIST "%~dp0\node\node.exe" (
  "%~dp0\node\node.exe"  "%~dp0\node\server\startserver.js" %*
) ELSE (
  node  "%~dp0\node\server\startserver.js" %*
)