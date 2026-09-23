export interface ColorsType {
  text: string;
  background: string;
  surface: string;
  secondary: string;
  primary: string;
  accent: string;
  surface2: string;
}

export const dark_colors: ColorsType = {
  text: "hsl(186, 70%, 91%)",
  background: "hsl(210, 27%, 13%)",
  surface: "hsl(207, 30%, 20%)",
  secondary: "hsl(192, 73%, 30%)",
  primary: "hsl(198, 60%, 55%)",
  accent: "hsl(358, 47%, 50%)",
  surface2: "hsla(207, 29%, 30%, 0.74)",
};

export const light_colors: ColorsType = {
  text: "hsl(210, 26%, 15%)",
  background: "hsl(192, 65%, 91%)",
  surface: "hsl(192, 50%, 97%)",
  secondary: "hsl(192, 73%, 30%)",
  primary: "hsl(198, 60%, 55%)",
  accent: "hsl(358, 47%, 50%)",
  surface2: "hsla(207, 29%, 30%, 0.74)",
};

//dark
//Text - hsl(186, 70%, 92%)
//background - hsl(210, 27%, 13%)
//Surface - hsla(207, 30%, 25%, 0.74)
//secondary - hsl(192, 73%, 30%)
//primary - hsl(198, 60%, 55%)
//Accent - hsl(358, 47%, 50%)

//light
//text - hsl(210, 26%, 15%) - #1c2630
//background - hsl(192, 65%, 91%) - #bdeaf5
//secondary - hsl(192, 73%, 30%) - #4a5568
//primary - hsl(198, 60%, 55%) - #3aa6c4
//Accent - hsl(358, 47%, 50%) - #ff6b6b
