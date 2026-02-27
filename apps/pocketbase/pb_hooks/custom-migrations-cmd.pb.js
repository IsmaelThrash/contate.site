/// <reference path="../pb_data/types.d.ts" />
// Usage: ./pocketbase horizons migrations:revert migration1.js migration2.js ...
// Reverts specific migrations by name (not by count like the built-in "down" command)

// Create a new "horizons" command group with "migrations:revert" subcommand
const horizonsCmd = new Command({
    use: "horizons",
    short: "Additional migration utilities",
})

horizonsCmd.addCommand(new Command({
    use: "migrations:revert [migration names...]",
    short: "Revert specific migrations by name and delete their files",
    run: (_cmd, args) => {
        if (args.length === 0) {
            console.log("Usage: horizons migrations:revert <migration1.js> [migration2.js] ...")
            console.log("No migrations specified to revert.")
            return
        }

        const migrationsDir = $filepath.join(__hooks, "../pb_migrations")
        
        const migrationFiles = {}
        try {
            const files = $os.readDir(migrationsDir)
            for (const file of files) {
                const name = file.name()
                migrationFiles[name] = $filepath.join(migrationsDir, name)
            }
        } catch (e) {
            console.error("Failed to read migrations directory:", e)
            return
        }

        const appliedMigrations = []
        for (const migrationName of args) {
            if (!migrationFiles[migrationName]) {
                console.error(`Migration file not found: ${migrationName}`)
                continue
            }

            try {
                const result = arrayOf(new DynamicModel({ file: "" }))
                $app.db()
                    .select("file")
                    .from("_migrations")
                    .where($dbx.hashExp({ file: migrationName }))
                    .limit(1)
                    .all(result)
                
                if (result.length === 0) {
                    console.log(`Migration ${migrationName} is not applied, skipping.`)
                    continue
                }
                
                appliedMigrations.push(migrationName)
            } catch (e) {
                console.error(`Failed to check migration status for ${migrationName}:`, e)
                continue
            }
        }

        if (appliedMigrations.length === 0) {
            console.log("No applied migrations found to revert.")
            return
        }

        console.log("\nMigrations to revert:")
        for (const name of appliedMigrations) {
            console.log(`${name}`)
        }

        const reverted = []
        
        $app.runInTransaction((txApp) => {
            for (const migrationName of appliedMigrations) {
                const filePath = migrationFiles[migrationName]
                
                try {
                    const content = toString($os.readFile(filePath))
                    
                    // Extract the down function from migrate(up, down) call
                    // We need to execute the file and capture the down function
                    let downFn = null
                    
                    const captureMigrate = (up, down) => {
                        downFn = down
                    }
                    
                    // Execute the migration file with our custom migrate function since hooks doesn't have access to migrate function
                    const migrationCode = content.replace(/migrate\s*\(/g, '__captureMigrate(')
                    const fn = new Function('__captureMigrate', '$app', 'Collection', 'Record', migrationCode)
                    fn(captureMigrate, txApp, Collection, Record)
                    
                    if (!downFn) {
                        console.log(`Migration ${migrationName} has no down function, just removing from history.`)
                    } else {
                        downFn(txApp)
                    }
                    
                    txApp.db().delete("_migrations", $dbx.hashExp({ file: migrationName })).execute()
                    
                    reverted.push({ name: migrationName, path: filePath })
                    console.log(`✓ Reverted: ${migrationName}`)
                } catch (e) {
                    throw new Error(`failed to revert migration ${migrationName}: ${e}`)
                }
            }
        })

        for (const migration of reverted) {
            $os.remove(migration.path)
        }

        console.log(`Successfully reverted ${reverted.length} migration(s).`)
    },
}))

$app.rootCmd.addCommand(horizonsCmd)
