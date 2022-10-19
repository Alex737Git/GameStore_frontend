import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../interfaces/category/ICategory';
import { CategoriesRepositoryService } from '../../services/repositories/category-repository.service';
import { ISelectedCategory } from '../../interfaces/category/ISelectedCategory';

@Component({
  selector: 'app-funcional-bar',
  templateUrl: './functional-bar.component.html',
  styleUrls: ['./functional-bar.component.scss'],
})
export class FunctionalBarComponent implements OnInit {
  showGenres: boolean;
  categories: ICategory[];
  selectedCategories: ISelectedCategory[] = [];
  constructor(private categoryRepo: CategoriesRepositoryService) {}

  ngOnInit(): void {
    this.categoryRepo.categoriesChanged.subscribe((c) => {
      this.categories = c;
    });
    this.categoryRepo.selectedCategoriesChanged.subscribe((c) => {
      this.selectedCategories = c;
    });
  }

  handleSelected($event: any) {
    if ($event.target.checked) {
      this.selectedCategories.push({
        id: $event.target.id,
        title: $event.target.labels[0].innerHTML,
      });
    } else {
      this.handleDeleteSelectedCategory($event.target.id);
    }
    console.log('handle Selected');
    this.categoryRepo.sendSelectedCategoriesStateChangeNotification(
      this.selectedCategories
    );
  }

  handleChecked(id: string): boolean {
    return !!this.selectedCategories.find((s) => s.id == id);
  }

  handleDeleteSelectedCategory(id: string) {
    this.selectedCategories = this.selectedCategories.filter(
      (c) => c.id !== id
    );
    this.categoryRepo.sendSelectedCategoriesStateChangeNotification(
      this.selectedCategories
    );
  }
  handleSearch(txt: any) {
    this.categoryRepo.sendSearchTxtStateChangeNotification(txt);
  }
}
