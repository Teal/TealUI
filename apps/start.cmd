@IF EXIST "%~dp0\node\node.exe" (
  "%~dp0\node\node.exe"  "%~dp0\node\server\start.js" %*
) ELSE (
  node  "%~dp0\node\server\start.js" %*
)