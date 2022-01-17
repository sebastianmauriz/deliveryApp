import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { ArticuloInsumoService } from 'src/app/services/articuloInsumo.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { RubroArticuloService } from 'src/app/services/rubroArticulo.service';
import { RubroArticulo } from 'src/app/models/RubroArticulo';

@Component({
  selector: 'app-insumo-form',
  templateUrl: './insumo-form.component.html',
  styleUrls: ['./insumo-form.component.css']
})
export class InsumoFormComponent implements OnInit {

  constructor(
    private service: ArticuloInsumoService,
    private serviceRubroArticulo: RubroArticuloService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) { }

  insumo: ArticuloInsumo = new ArticuloInsumo();
  error: any;
  titulo = "Insumo"
  adminId!: any;
  rubros: RubroArticulo[] = [];


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('idi')!;
      this.adminId = +params.get('ida')!;
      if (id) {
        this.service.ver(id).subscribe(insumo => this.insumo = insumo)
      }
    })

    this.serviceRubroArticulo.listar().subscribe(rubro => {
      this.rubros = rubro as RubroArticulo[];
    });

  }

  public crear(): void {
    if (this.insumo.denominacion != null && this.insumo.esInsumo != null &&
      this.insumo.precioCompra != null && this.insumo.precioVenta != null &&
      this.insumo.rubroArticulo != null && this.insumo.stockActual != null &&
      this.insumo.stockMinimo != null && this.insumo.unidadMedida != null) {


      this.service.crear(this.insumo).subscribe(insumo => {
        Swal.fire('Nuevo:', `Insumo ${insumo.denominacion} creado con éxito`, 'success');
        this.router.navigate(['/admin', this.adminId]);
      }, err => {
        if (err.status === 400) {
          this.error = err.error;
          console.log(this.error);
        }
      });

    } else {
      Swal.fire('Error:', `Faltan llenar campos`, 'error');
    }
  }


  public editar(): void {
    if (this.insumo.denominacion != "" && this.insumo.esInsumo != undefined &&
      this.insumo.precioCompra != null && this.insumo.precioVenta != null &&
      this.insumo.rubroArticulo != null && this.insumo.stockActual != null &&
      this.insumo.stockMinimo != null && this.insumo.unidadMedida != "") {
      this.service.editar(this.insumo).subscribe(insumo => {
        console.log(insumo);
        Swal.fire('Modificado:', `Manufacturado ${insumo.denominacion} actualizado con éxito`, 'success');
        this.router.navigate(['/admin', this.adminId]);
      }, err => {
        if (err.status === 400) {
          this.error = err.error;
          console.log(this.error);
        }
      });
    } else {
      Swal.fire('Error:', `Faltan llenar campos`, 'error');
    }
  }

  //boton para volver para atras ya que se usa en admin y el cocinero

  volver() {
    this.location.back();
  }

  setearInsumo(esInsumo: boolean) {
    this.insumo.esInsumo = esInsumo;
  }

  asignarRubro(rubro: RubroArticulo) {
    this.insumo.rubroArticulo = rubro;
  }


}
