export interface Roommate {
  id: string;
  name: string;
}

export interface GroceryItem {
  id: string;
  item: string;
  addedBy: string;
  addedByName: string;
  createdAt: Date;
}

export interface Purchase {
  id: string;
  roommateId: string;
  roommateName: string;
  amount: number;
  date: Date;
  notes?: string | null;
}

export interface PurchaseItem {
  purchaseId: string;
  groceryItemId: string;
}
