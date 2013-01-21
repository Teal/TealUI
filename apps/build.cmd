@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\dpl\bin\build.js" %*
) ELSE (
  node  "%~dp0\dpl\bin\build.js" %*
)