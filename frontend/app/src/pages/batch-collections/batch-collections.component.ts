import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import moment from 'moment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-batch-collections',
  standalone: true,
  imports: [HeaderComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './batch-collections.component.html',
  styleUrl: './batch-collections.component.scss'
})
export class BatchCollectionsComponent {

  batchId: string = '';
  c_page_number = 1;
  c_page_size = 5;
  c_pages: any = [];
  collections: any = [];
  m_page_number = 1;
  m_page_size = 5;
  m_pages: any = [];
  mothers: any = [];
  constructor(private readonly route: ActivatedRoute, private backend: BackendService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.batchId = this.route.snapshot.paramMap.get('id') || '';
    this.listCollections()
    this.listMothers()
  }

  listCollections(reset_page: boolean = true) {
    this.backend.getCollections(this.batchId, this.c_page_number, this.c_page_size).subscribe({
      next: (data: any) => {
        this.collections = data?.results || [];
        if(reset_page){
          this.c_pages = []
          for (let i = 1; i <= (this.collections.length / this.c_page_size) + 1; i++) {
            this.c_pages.push(i)
          }
        }
      },
      error: (error: any) => {
        this.toast.showError(error.error);
      }
    }
    )
  }

  createCollection(mother: any){
    this.backend.addCollection(this.batchId, {
      quantity: mother.input_quantity,
      mother: mother.id,
      collected_at: moment(mother?.collected_at, 'YYYY-MM-DD HH:mm').utc(),
      batch: this.batchId
    }).subscribe({
      next: () => {
        mother.input_quantity = null;
        mother.collected_at = moment().format('YYYY-MM-DD HH:mm');
        this.listCollections();
        this.listMothers();
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    })
  }


  deleteCollection(id: string) {
    this.backend.deleteCollection(this.batchId, id).subscribe({
      next: () => {
        this.listCollections()
        this.listMothers()
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )
  }

  nextCollectionPage() {
    if (this.c_page_number < this.c_pages.length) {
      this.c_page_number += 1
      this.listCollections(false)
    }
  }

  previousCollectionPage() {
    if (this.c_page_number > 1) {
      this.c_page_number -= 1
      this.listCollections(false)
    }
  }

  changeCollectionPage(page: number) {
    if (this.c_page_number != page) {
      this.c_page_number = page
      this.listCollections(false)
    }
  }

  listMothers(reset_page: boolean = true) {
    this.backend.getMothers(this.m_page_number, this.m_page_size).subscribe({
      next: (data: any) => {
        this.mothers = data?.results || [];
        this.mothers.forEach((mother: any) => {
          mother.collected_at = moment().format('YYYY-MM-DD HH:mm');
        });
        if (reset_page) {
          this.m_pages = []
          for (let i = 1; i <= (this.mothers.length / this.m_page_size) + 1; i++) {
            this.m_pages.push(i)
          }
        }
      },
      error: (error) => {
        this.toast.showError(error.error);
      }
    }
    )
  }

  nextMotherPage() {
    if (this.m_page_number < this.m_pages.length) {
      this.m_page_number += 1
      this.listMothers(false)
    }
  }

  previousMotherPage() {
    if (this.m_page_number > 1) {
      this.m_page_number -= 1
      this.listMothers(false)
    }
  }

  changeMotherPage(page: number) {
    if (this.m_page_number != page) {
      this.m_page_number = page
      this.listMothers(false)
    }
  }
}
