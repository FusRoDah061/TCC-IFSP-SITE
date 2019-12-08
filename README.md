# Configurações

## AWS EC2

### Configuração do Apache

É necessário ter [configurado a API](https://github.com/FusRoDah061/TCC-IFSP-API) do sistema antes.

Será necessário criar um virtual-hosts (vhost) para o front-end do sistema.

- Entre no diretório de hosts do Apache: `cd /etc/apache2/sites-available`;
- Crie um arquivo `.conf` para o vhost da API, por exemplo, `tcc-site.conf`;
- Dentro desse arquivo, entre o seguinte código:

```xml

<VirtualHost *:80>
	ServerAdmin webmaster@email.com
	ServerName site.com
	ServerAlias 1.1.1.1
	DocumentRoot /var/www/html/tcc/api/public/app

	<Directory /var/www/html/tcc/api/public/app/ >
		Options Indexes FollowSymLinks MultiViews
		AllowOverride All
		Order allow,deny
		allow from all
		Require all granted
	</Directory>

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

```

- Alguns pontos de atenção:
  - `DocumentRoot` indica o diretório onde estão os arquivos de entrada do sistema, nessa caso, o arquivo `index.html`;
  - Note a `/` ao final do diretório em `Directory`. Mantenha essa barra no final.
  - `ServerAdmin`, `ServerName` e `ServerAlias` devem ser preenchidos de acordo com suas configurações;
  - `ServerName` será o **enderço** pelo qual o usuário acessa a aplicação. **Não utilizar o DNS público do EC2**;
  - `ServerAlias` será o **endereço IP** da instância EC2.
- Habilite o novo vhost no Apache: `sudo a2ensite tcc-site.conf`;
- Habilite o `mod_rewrite` no Apache: `sudo a2enmod rewrite`;
- Reinicie o Apache: `sudo service apache2 restart`.

Caso seja necessário manter o firewall da VM ativo, tenha certeza de permitir conexões **SSH** e **HTTP** (ou HTTPS).

O controle de conexões poderá ser feito pelo grupos de segurança do AWS, mas se o firewall da máquina não liberar essas conexões, a configuração do AWS não terá efeito.


### Deploy com Git hooks

Vamos configurar um repositório bare na instância EC2 para fazermos *code push* de novas alterações.

Nesse repositório, vamos criar um hook `post-receive` para que, após todo push feito para a branch `master`, seja executado um script de *"deploy"*, que vai fazer o checkout das novas alterações na pasta do Apache, e executar os comandos de instalação do npm e copiar os arquivos para o Laravel.

**Pré-requisitos:**
- [Apache](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-16-04) instalado;
- [Git](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-16-04) instalado;
- [Node e NPM](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04) instalados;
- [API](https://github.com/FusRoDah061/TCC-IFSP-API) configurada.

#### Criação do hook

Este processo usou como referência [este guia](https://www.digitalocean.com/community/tutorials/how-to-use-git-hooks-to-automate-development-and-deployment-tasks).

- Acesse a instância EC2 onde o sistema está hospedado.
- Entre na pasta `/var/www/html`.
- Crie uma pasta `git`, e dentro dela uma pasta `tcc-front.git`;
- Inicialize um repositório bare (não contém os arquivos de código) com o comando: `git init --bare`;
- Dentre as pastas que foram criadas, entre na pasta `hooks`;
- Devem existir vários arquivos `.sample`, que são alguns exemplos de hooks possíveis. Crie um novo arquivo chamado `post-receive` (sem extensão), esse será o nosso hook de deploy;
- Dentro desse arquivo, coloque o seguinte código:

```bash

#!/bin/bash
echo "Received push from local repo."
while read oldrev newrev ref
do
	if [[ $ref =~ .*/master$ ]];
	then
		echo "Master ref received.  Deploying master branch to production..."
		mkdir /var/www/html/tcc/site
		git --work-tree=/var/www/html/tcc/site --git-dir=/var/www/html/git/tcc-front.git checkout -f
		cd /var/www/html/tcc/site
		npm install
		npm run build --modern
		cp -a -f dist/. /var/www/html/tcc/api/public/app/
	else
		echo "Ref $ref successfully received.  Doing nothing: only the master branch may be deployed on this server."
	fi
done

echo "All done here."

```

- Note o comando `git --work-tree=/var/www/html/tcc/site --git-dir=/var/www/html/git/tcc-front.git checkout -f`: 
  - `/var/www/html/tcc/site`: diretório onde está o repositório git comum com código da API;
  - `var/www/html/git/tcc-front.git`: diretório desse repositóroio bare.
- Nos comandos após este, vamos:
  - entrar no diretório que contém o código: `cd /var/www/html/tcc/site`;
  - instalar as dependências do projeto: `npm install`;
  - empacotar e otimizar os arquivos do projeto: `npm run build --modern`;
  - copiar os arquivos empacotados para os artefatos públicos da api: `cp -a -f dist/. /var/www/html/tcc/api/public/app/`
- Dê permissão total à pasta git para o usuário: `chmod -R 777 /var/www/html/git`;
- Utilize SSH para fazer push de novas alterações. No endereço do remote, adicione uma URL SSH no formato: `ssh://usuario@endereco.ec2.com:22/var/www/html/git/tcc-front.git` (será necessário configurar no git a chave pública de acesso SSH ao EC2).

## Vue

Iniciar o servidor de desenvolvimento: `npm run serve`

### .env

Podem ser utilizados 2 arquivos .env: um local para desenvolvimento (`.env.development.local`) e um para produção (`.env.production.local`). As propriedades a serem definidas são:

- `VUE_APP_RECAPTCHA_KEY`: Chave pública de acesso a API do Recaptcha
- `VUE_APP_API_URL`: URL base para as chamadas da api, por exemplo `http://localhost/api`
- `VUE_APP_SIMBOLO_IMAGEM`: **Constante** que indica um símbolo de imagem. Valor: `1`
- `VUE_APP_SIMBOLO_VIDEO`: **Constante** que indica um símbolo de vídeo. Valor: `2`
- `VUE_APP_CATEGORIA_TODOS`: **Constante** que indica a categoria "Todos os simbolos". Valor: `all`
- `VUE_APP_CATEGORIA_MEUS`: **Constante** que indica a categoria "Meus simbolos". Valor: `user`
- `VUE_APP_IMG_FILE_SIZE_MB`: Tamanho máximo dos arquivos de imagem.
- `VUE_APP_VIDEO_FILE_SIZE_MB`: Tamanho máximo dos arquivos de vídeo.
