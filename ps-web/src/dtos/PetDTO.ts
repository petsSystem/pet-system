export interface PetDTO {
  id: string;
  customerId: string;
  name: string;
  color: string;
  gender: "MALE" | "FEMALE";
  specie: "DOG" | "CAT" | "OTHER";
  birthDate: string;
  neutered: boolean;
  temper: "EASY" | "MODERATE" | "CHALLENGING";
  coat: "SHORT" | "MEDIUM" | "LONG";
  weight: number;
  breed: string;
  size: "P" | "M" | "G";
  active: boolean;
}
