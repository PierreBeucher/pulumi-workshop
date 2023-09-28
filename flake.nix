{
  description = "Pulumi workshop";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: 
    flake-utils.lib.eachDefaultSystem (system:
      let  
        pkgs = nixpkgs.legacyPackages.${system}; 

        deployPackages = with pkgs; [
          google-cloud-sdk
          gnumake
          pulumi
          pulumiPackages.pulumi-language-nodejs
          nodejs-slim
          nodePackages.npm
          nodePackages.pnpm
        ];
      in {
        devShells = {
          default = pkgs.mkShell {
            packages = deployPackages;

            shellHook = ''
            '';
          };
        };
      }
    );
}
