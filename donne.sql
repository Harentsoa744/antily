
-- ============================================
-- 1. NIVEAUX TERRITORIAUX
-- ============================================

INSERT INTO territory_level (level, name) VALUES
(1, 'Diosezy'),
(2, 'Faritra'),
(3, 'Fivondronana');


-- ============================================
-- 2. TERRITOIRES
-- Diosezy > Faritra > Fivondronana
-- ============================================

INSERT INTO territory (name, number, territory_level_id)
SELECT 'Diosezy Antananarivo', 1, id
FROM territory_level WHERE name = 'Diosezy';

INSERT INTO territory (name, number, territory_dependance_id, territory_level_id)
SELECT 'Faritra Avaratra', 1, t.id, tl.id
FROM territory t
CROSS JOIN territory_level tl
WHERE t.name = 'Diosezy Antananarivo'
  AND tl.name = 'Faritra';

INSERT INTO territory (name, number, territory_dependance_id, territory_level_id)
SELECT 'Faritra Atsimo', 2, t.id, tl.id
FROM territory t
CROSS JOIN territory_level tl
WHERE t.name = 'Diosezy Antananarivo'
  AND tl.name = 'Faritra';

INSERT INTO territory (name, number, territory_dependance_id, territory_level_id)
SELECT 'Fivondronana Ivato', 1, t.id, tl.id
FROM territory t
CROSS JOIN territory_level tl
WHERE t.name = 'Faritra Avaratra'
  AND tl.name = 'Fivondronana';

INSERT INTO territory (name, number, territory_dependance_id, territory_level_id)
SELECT 'Fivondronana Ambohitrimanjaka', 2, t.id, tl.id
FROM territory t
CROSS JOIN territory_level tl
WHERE t.name = 'Faritra Avaratra'
  AND tl.name = 'Fivondronana';

INSERT INTO territory (name, number, territory_dependance_id, territory_level_id)
SELECT 'Fivondronana Itaosy', 3, t.id, tl.id
FROM territory t
CROSS JOIN territory_level tl
WHERE t.name = 'Faritra Atsimo'
  AND tl.name = 'Fivondronana';

INSERT INTO territory (name, number, territory_dependance_id, territory_level_id)
SELECT 'Fivondronana Anosizato', 4, t.id, tl.id
FROM territory t
CROSS JOIN territory_level tl
WHERE t.name = 'Faritra Atsimo'
  AND tl.name = 'Fivondronana';


-- ============================================
-- 3. ANNEE D'ADHESION
-- ============================================

INSERT INTO membership_year (label)
VALUES ('2026-2027');


-- ============================================
-- 4. BRANCHES DES BEAZINA
-- ============================================

INSERT INTO branch (name) VALUES
('Lovitao'),
('Mpianjoria'),
('Mpamakilay'),
('Mpiandalana');


-- ============================================
-- 5. RESPONSABILITES ET ROLES
-- ============================================

-- Responsabilites au niveau Fivondronana

INSERT INTO role (territory_level_id, branch_id, is_youth, label)
SELECT id, NULL, FALSE, 'Mpiandraikitra'
FROM territory_level WHERE name = 'Fivondronana';

INSERT INTO role (territory_level_id, branch_id, is_youth, label)
SELECT id, NULL, FALSE, 'Tonia'
FROM territory_level WHERE name = 'Fivondronana';

-- Responsabilites au niveau Faritra

INSERT INTO role (territory_level_id, branch_id, is_youth, label)
SELECT id, NULL, FALSE, 'Filohamparitra'
FROM territory_level WHERE name = 'Faritra';

INSERT INTO role (territory_level_id, branch_id, is_youth, label)
SELECT id, NULL, FALSE, 'Filohamparitra mpanampy'
FROM territory_level WHERE name = 'Faritra';

-- Un Filohan-tsampana pour chaque branche

INSERT INTO role (territory_level_id, branch_id, is_youth, label)
SELECT tl.id, b.id, FALSE, 'Filohan-tsampana'
FROM territory_level tl
CROSS JOIN branch b
WHERE tl.name = 'Faritra';

-- Responsabilite au niveau Diosezy

INSERT INTO role (territory_level_id, branch_id, is_youth, label)
SELECT id, NULL, FALSE, 'Filohan-diosezy'
FROM territory_level WHERE name = 'Diosezy';

-- Roles des Beazina au niveau Fivondronana

INSERT INTO role (territory_level_id, branch_id, is_youth, label)
SELECT tl.id, b.id, TRUE, b.name
FROM territory_level tl
CROSS JOIN branch b
WHERE tl.name = 'Fivondronana';


-- ============================================
-- 6. MEMBRES
-- Donnees fictives pour les tests
-- ============================================

INSERT INTO member (name, firstname, date_of_birth, email, phone)
VALUES
('Rakoto', 'Andry', '2014-05-12', 'andry@example.com', '0340000001'),
('Rabe', 'Mialy', '2012-02-20', 'mialy@example.com', '0340000002'),
('Randria', 'Hery', '2010-11-08', 'hery@example.com', '0340000003'),
('Rasoa', 'Fanja', '2008-07-15', 'fanja@example.com', '0340000004'),
('Rakotomalala', 'Tiana', '1995-03-10', 'tiana@example.com', '0340000005'),
('Razanakoto', 'Solo', '1990-09-25', 'solo@example.com', '0340000006'),
('Andriamihaja', 'Hasina', '1988-01-17', 'hasina@example.com', '0340000007'),
('Rasoanaivo', 'Lova', '1992-12-03', 'lova@example.com', '0340000008'),
('Rajaonarison', 'Fetra', '1991-04-22', 'fetra@example.com', '0340000009'),
('Rakotobe', 'Niry', '1989-08-14', 'niry@example.com', '0340000010'),
('Randriamampianina', 'Mamy', '1993-06-18', 'mamy@example.com', '0340000011'),
('Rasolofoniaina', 'Hanta', '1987-10-30', 'hanta@example.com', '0340000012'),
('Andrianina', 'Jean', '1985-01-09', 'jean@example.com', '0340000013');


-- ============================================
-- 7. COTISATIONS
-- Exemple : 10 000 par role pour 2026-2027
-- ============================================

INSERT INTO membership_fee (membership_year_id, fee, role_id)
SELECT my.id, 10000, r.id
FROM membership_year my
CROSS JOIN role r
WHERE my.label = '2026-2027';


-- ============================================
-- 8. PAIEMENTS
-- status = 1 : paye
-- status = 0 : en attente
-- ============================================

INSERT INTO membership_payment (date, amount, status)
VALUES
('2026-10-01', 10000, 1),
('2026-10-02', 10000, 1),
('2026-10-03', 10000, 1),
('2026-10-04', 10000, 0),
('2026-10-05', 10000, 1),
('2026-10-06', 10000, 1),
('2026-10-07', 10000, 0),
('2026-10-08', 10000, 1),
('2026-10-09', 10000, 1),
('2026-10-10', 10000, 0),
('2026-10-11', 10000, 1),
('2026-10-12', 10000, 1),
('2026-10-13', 10000, 1);


-- ============================================
-- 9. ADHESIONS
-- Chaque membre est associe a son role,
-- son territoire, sa cotisation et son paiement.
-- ============================================

WITH affectations(email, territoire, role_label, branche, date_paiement) AS (
    VALUES
    ('andry@example.com', 'Fivondronana Ivato', 'Lovitao', 'Lovitao', DATE '2026-10-01'),
    ('mialy@example.com', 'Fivondronana Ivato', 'Mpianjoria', 'Mpianjoria', DATE '2026-10-02'),
    ('hery@example.com', 'Fivondronana Ivato', 'Mpamakilay', 'Mpamakilay', DATE '2026-10-03'),
    ('fanja@example.com', 'Fivondronana Ivato', 'Mpiandalana', 'Mpiandalana', DATE '2026-10-04'),
    ('tiana@example.com', 'Fivondronana Ivato', 'Mpiandraikitra', NULL, DATE '2026-10-05'),
    ('solo@example.com', 'Fivondronana Ivato', 'Tonia', NULL, DATE '2026-10-06'),
    ('hasina@example.com', 'Faritra Avaratra', 'Filohamparitra', NULL, DATE '2026-10-07'),
    ('lova@example.com', 'Faritra Avaratra', 'Filohamparitra mpanampy', NULL, DATE '2026-10-08'),
    ('fetra@example.com', 'Faritra Avaratra', 'Filohan-tsampana', 'Lovitao', DATE '2026-10-09'),
    ('niry@example.com', 'Faritra Avaratra', 'Filohan-tsampana', 'Mpianjoria', DATE '2026-10-10'),
    ('mamy@example.com', 'Faritra Atsimo', 'Filohan-tsampana', 'Mpamakilay', DATE '2026-10-11'),
    ('hanta@example.com', 'Faritra Atsimo', 'Filohan-tsampana', 'Mpiandalana', DATE '2026-10-12'),
    ('jean@example.com', 'Diosezy Antananarivo', 'Filohan-diosezy', NULL, DATE '2026-10-13')
)
INSERT INTO membership (
    territory_id,
    member_id,
    role_detail,
    status,
    membership_fee_id,
    membership_payment_id
)
SELECT
    t.id,
    m.id,
    a.role_label,
    1,
    mf.id,
    mp.id
FROM affectations a
JOIN member m ON m.email = a.email
JOIN territory t ON t.name = a.territoire
JOIN membership_year my ON my.label = '2026-2027'
JOIN role r
    ON r.label = a.role_label
   AND (
       (a.branche IS NULL AND r.branch_id IS NULL)
       OR r.branch_id = (
           SELECT b.id FROM branch b
           WHERE b.name = a.branche
       )
   )
JOIN membership_fee mf
    ON mf.role_id = r.id
   AND mf.membership_year_id = my.id
JOIN membership_payment mp
    ON mp.date = a.date_paiement;


-- ============================================
-- 10. UTILISATEUR ADMINISTRATEUR
-- Le hash doit etre genere par le backend.
-- ============================================

INSERT INTO users (name, password_hash, email, role)
VALUES (
    'Administrateur',
    '$2b$12$REMPLACER_PAR_UN_HASH_BCRYPT_VALIDE',
    'admin@example.com',
    'admin'
);


-- ============================================
-- 11. VERIFICATION DES DONNEES
-- ============================================

SELECT tl.name AS niveau, t.name AS territoire, t.number
FROM territory t
JOIN territory_level tl ON tl.id = t.territory_level_id
ORDER BY tl.level, t.number;

SELECT m.firstname, m.name, t.name AS territoire,
       r.label AS responsabilite, b.name AS branche,
       mf.fee, mp.amount, mp.status AS statut_paiement
FROM membership ms
JOIN member m ON m.id = ms.member_id
JOIN territory t ON t.id = ms.territory_id
JOIN membership_fee mf ON mf.id = ms.membership_fee_id
JOIN role r ON r.id = mf.role_id
LEFT JOIN branch b ON b.id = r.branch_id
LEFT JOIN membership_payment mp ON mp.id = ms.membership_payment_id
ORDER BY t.name, m.name;
