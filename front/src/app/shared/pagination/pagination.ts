import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
})
export class Pagination {
  public readonly page = input.required<number>();
  public readonly totalPages = input.required<number>();

  public readonly pageChange = output<number>();

  protected goTo(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.pageChange.emit(page);
  }
}
