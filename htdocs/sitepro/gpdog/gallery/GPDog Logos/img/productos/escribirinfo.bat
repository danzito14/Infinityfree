@echo off
setlocal enabledelayedexpansion

:: Definir el archivo de salida
set "output=lista_fotos.csv"

:: Obtener la ruta de la carpeta raíz
set "raiz=%CD%"

:: Escribir la cabecera del CSV
echo Nombre, Ruta, Carpeta > "%output%"

:: Recorrer todas las imágenes en el directorio y subdirectorios
for /r %%F in (*.jpg *.png *.jpeg *.gif *.bmp) do (
    set "ruta=%%F"
    set "nombre=%%~nF"
    set "carpeta=%%~dpF"
    set "carpeta=!carpeta:~0,-1!"

    :: Obtener ruta relativa eliminando la parte de la ruta de la carpeta raíz
    set "relativa=!ruta:%raiz%\=!"

    for %%A in ("!carpeta!") do set "nombre_carpeta=%%~nxA"
    
    :: Escribir en el archivo CSV con ruta relativa
    echo !nombre!, !relativa!, !nombre_carpeta! >> "%output%"
)

echo Archivo "%output%" generado con éxito.
pause
