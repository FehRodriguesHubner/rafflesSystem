
CREATE TABLE cGroups(
	idCGroup varchar(36) primary key,
    referenceCode int not null,
    label varchar(50) not null,
    nameContact varchar(50),
    numberContact varchar(50),
    email varchar(50),
    password char(32),
    createdAt datetime default CURRENT_TIMESTAMP(),
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP()
);


CREATE TABLE stores(
    idStore varchar(36) primary key,
    referenceCode int not null,
	idCGroup varchar(36) not null,
    label varchar(50) not null,
    instructions text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci not null,
    nameContact varchar(50),
    numberContact varchar(50),
    cnpj varchar(50),
    razaoSocial varchar(50),
    inscricaoEstadual varchar(50),
    endereco varchar(50),
    numero varchar(50),
    bairro varchar(50),
    cidade varchar(50),
    uf varchar(50),
    cep varchar(50),
    createdAt datetime default CURRENT_TIMESTAMP(),
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP(),
    FOREIGN KEY (idCGroup) REFERENCES cGroups(idCGroup)
);


CREATE TABLE groups(
    idGroup varchar(36) primary key not null,
    referenceCode int not null,
    idStore varchar(36) not null,
    label varchar(50) not null,
    phoneId varchar(50) not null,
    link text not null,
    adminPhones longtext,
    botStatus boolean not null,
    status boolean not null,
    triggerMessage varchar(100),
    redirectLink text,
    createdAt datetime default CURRENT_TIMESTAMP(),
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP(),
    FOREIGN KEY (idStore) REFERENCES stores(idStore)
);

CREATE TABLE raffles(
    idRaffle varchar(36) primary key not null,
    referenceCode int not null,
    idGroup varchar(36) not null,
    status boolean not null,
    raffleDate DATE,
    price float not null,
    numbers int not null,
    instructions text,
    buyLimit int,
    resultLink text,
    percentageNotify int,
    flatNotify int,
    createdAt datetime default CURRENT_TIMESTAMP(),
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP(),
    FOREIGN KEY (idGroup) REFERENCES groups(idGroup)
);


CREATE TABLE awards(
    idAward varchar(36) primary key not null,
    idRaffle varchar(36) not null,
    referenceCode int not null,
    description longtext not null,
    drawnNumber int,
    createdAt datetime default CURRENT_TIMESTAMP(),
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP(),
    FOREIGN KEY (idRaffle) REFERENCES raffles(idRaffle)
);

CREATE TABLE participants(
    idParticipant varchar(36) primary key not null,
    idRaffle varchar(36) not null,
    phoneId varchar(50) not null,
    drawnNumber int not null,
    paid boolean not null default 0,
    name varchar(50),
    pix longtext,
    createdAt datetime default CURRENT_TIMESTAMP(),
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP(),
    FOREIGN KEY (idRaffle) REFERENCES raffles(idRaffle)
);