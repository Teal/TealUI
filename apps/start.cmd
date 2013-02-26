@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\tools\server\start.js" %*
) ELSE (
  node  "%~dp0\tools\server\start.js" %*
)