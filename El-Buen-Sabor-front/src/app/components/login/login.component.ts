import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Cliente } from 'src/app/models/Cliente';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { envelopeOpenFill } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  usuario!: Usuario;
  user!: string;
  clave!: string;
  socialUser!: SocialUser;
  userLogged!: SocialUser;
  isLogged!: boolean;
  passCrypto: string = "lrisK34b";

  constructor(
    private service: UsuarioService,
    private router: Router,
    private authService: SocialAuthService) { }


  ngOnInit(): void {
    //verificar si estoy logueado
    this.authService.authState.subscribe(data => {
      this.userLogged = data;
      this.isLogged = (this.userLogged != null);
    });
    console.log(CryptoJS.AES.encrypt('123', 'teamvicious'));
  }

  //loguar y validar rol
  login() {

    this.service.validarUserMail(this.user).subscribe(user => {
      try {
        this.usuario = user;
        var bytes = CryptoJS.AES.decrypt(user.clave, 'teamvicious');

        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        if (this.usuario.usuario == originalText) {
          Swal.fire('INCORRECTO!', 'Este usuario corresponde a un google user y no se puede loguear!', 'error');
        } else {

          if (originalText == this.clave) {


            if (this.usuario.rol == "admin") {
              this.router.navigate(['/admin/', this.usuario.id]);
            }
            if (this.usuario.rol == "cocinero") {
              this.router.navigate(['/cocinero/', this.usuario.id]);
            }
            if (this.usuario.rol == "cajero") {
              this.router.navigate(['/cajero/', this.usuario.id]);
            }
            if (this.usuario.rol == "user") {
              this.router.navigate(['/home/', this.usuario.id]);
            }
            if (this.usuario.rol == "userg") {
              this.router.navigate(['/home/', this.usuario.id]);
            }
            if (this.usuario.rol == "delivery") {
              this.router.navigate(['/delivery/', this.usuario.id]);
            }
          } else {
            Swal.fire('INCORRECTO!', 'usuario o contraseña incorrectos! <br> Si no esta registrado, por favor registrese!', 'error');
          }
        }
      } catch (error) {
        Swal.fire('INCORRECTO!', 'usuario o contraseña incorrectos! <br> Si no esta registrado, por favor registrese!', 'error');
      }
    }, err => {
      console.log(err)
      Swal.fire('INCORRECTO!', 'usuario o contraseña incorrectos! <br> Si no esta registrado, por favor registrese!', 'error');
    });

  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      this.socialUser = data;
      this.isLogged = true;

      //intertar buscar en la db el user y contraseña, en caso contrario hacer un register del usuario
      //usuario=nombre de google y la contraseña sera email de google 
      try {
        //loguear usuario/contraseña
        this.service.validarUserMail(this.socialUser.email).subscribe(user => {
          this.usuario = user;
          //si puede traer el usuario que redireccione
          if (this.usuario) {
            var bytes = CryptoJS.AES.decrypt(this.usuario.clave, 'teamvicious');

            var emailDecrypt = bytes.toString(CryptoJS.enc.Utf8);

            if (this.usuario.usuario == emailDecrypt) {
              this.router.navigate(['/home/', this.usuario.id]);

            } else {
              Swal.fire('ERROR!', 'No se pudo registrar con google 1', 'warning');
            }

          } else {
            Swal.fire('ERROR!', 'No se pudo registrar con google 2', 'warning');
          }
        }, error => {
          //codigo registrar
          //var bytes = CryptoJS.AES.encrypt(this.socialUser.email, 'teamvicious');

          //var emailDecrypt = bytes.toString(CryptoJS.enc.Utf8);

          //registrar/crear el objeto y asignarle los atributos
          var usuarioAux: Usuario = new Usuario();
          var clienteAux: Cliente = new Cliente();
          usuarioAux.usuario = this.socialUser.email;
          usuarioAux.clave = (CryptoJS.AES.encrypt(this.socialUser.email, 'teamvicious')).toString();
          usuarioAux.rol = "userg";
          clienteAux.nombre = this.socialUser.firstName;
          clienteAux.apellido = this.socialUser.lastName;
          clienteAux.email = this.socialUser.email;
          usuarioAux.cliente = clienteAux;

          this.service.crear(usuarioAux).subscribe(user => {
            this.usuario = user;

            Swal.fire({
              title: 'Logueado con exito!',
              text: `ahora solo queda ingresar su domicilio!`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok, llenar!',
              cancelButtonText: 'Hacerlo mas tarde'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/updateDomicilio/', this.usuario.id]);
              } else {
                this.router.navigate(['/home/', this.usuario.id]);
              }
            });

          });


        });

      } catch (error) {

        console.log("no se pudo loguear ni registrar con google", error);
        Swal.fire('ERROR!', 'No se pudo registrar con google 3', 'warning');
      }

      //cerrar sesion
      this.signOut();
    });

  }

  signOut(): void {
    this.authService.signOut();
  }
}
