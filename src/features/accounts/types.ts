export interface Subgroup {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  subgroups: Subgroup[];
}

export interface AccountDto {
  name: string;
  group: 'Fixed' | 'Variable';
  subGroup: string;
}

export interface Account {
  id: string;
  name: string;
  groups: Group[];
} 