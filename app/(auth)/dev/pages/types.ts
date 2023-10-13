export interface Page {
   id?: string | number;
   name?: string;
   iconName?: string;
   iconColor?: string;
   route?: string;
   displayOrder?: string | number;
   showOnSidebar?: boolean;
   parentPageId?: string | number;
   pages?: Array<Page>;
   sections?: Array<Page>;
}
