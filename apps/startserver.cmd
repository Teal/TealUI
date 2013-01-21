@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\server\startserver.js" %*
) ELSE (
  node  "%~dp0\server\startserver.js" %*
)