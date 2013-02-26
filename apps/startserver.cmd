@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\tools\server\startserver.js" %*
) ELSE (
  node  "%~dp0\tools\server\startserver.js" %*
)