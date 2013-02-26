@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\tools\modulebuilder\bin\build.js" %*
) ELSE (
  node  "%~dp0\tools\modulebuilder\bin\build.js" %*
)