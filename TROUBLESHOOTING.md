# Troubleshooting Guide

Common issues and their solutions for Heal-Io setup and deployment.

## Docker Issues

### Container Build Failures

**Problem**: Docker build fails with "out of memory" error
```
Solution: Increase Docker memory allocation
- Docker Desktop: Settings → Resources → Memory (set to 4GB+)
- Linux: Adjust Docker daemon settings
```

**Problem**: Port already in use (3000, 8000, 8080, 80)
```bash
# Check which process is using the port
lsof -i :3000

# Kill the process or change port in docker-compose.yml
```

**Problem**: Docker containers won't start
```bash
# Check container logs
docker-compose logs [service-name]

# Common fixes:
docker-compose down
docker-compose up --build -d
```

### Permission Issues

**Problem**: Permission denied errors in containers
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# For Laravel storage
docker-compose exec api chmod -R 777 storage bootstrap/cache
```

## Database Issues

### Migration Failures

**Problem**: Database migrations fail
```bash
# Wait for DB to be ready (add sleep if needed)
docker-compose exec api php artisan migrate:fresh

# Check database connection
docker-compose exec api php artisan tinker
>>> DB::connection()->getPdo();
```

**Problem**: "Connection refused" to MySQL
```
Solution: Database container takes time to initialize
- Wait 30-60 seconds after docker-compose up
- Check database health: docker-compose ps
```

## Frontend Issues

### Node Module Issues

**Problem**: Module not found errors
```bash
# Inside frontend directory
rm -rf node_modules package-lock.json
npm install

# Or use Docker
docker-compose exec frontend npm install
```

**Problem**: Build fails with memory error
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Environment Variables

**Problem**: API calls fail with CORS errors
```
Solution: Check .env file
- Verify REACT_APP_API_URL is correct
- Ensure backend CORS settings allow frontend origin
```

## Backend API Issues

### Composer Issues

**Problem**: Composer install fails
```bash
# Clear composer cache
docker-compose exec api composer clear-cache

# Update dependencies
docker-compose exec api composer update
```

**Problem**: Class not found errors
```bash
# Regenerate autoload files
docker-compose exec api composer dump-autoload
```

### Laravel Issues

**Problem**: "Application key not set"
```bash
docker-compose exec api php artisan key:generate
```

**Problem**: Storage permissions
```bash
docker-compose exec api chmod -R 775 storage
docker-compose exec api chmod -R 775 bootstrap/cache
```

## AI Service Issues

### Python Package Issues

**Problem**: Import errors for Python packages
```bash
# Reinstall requirements
docker-compose exec ai-service pip install -r requirements.txt --force-reinstall
```

**Problem**: OpenCV import fails
```
Solution: Install system dependencies
- Already included in Dockerfile
- If running locally: apt-get install libgl1-mesa-glx
```

### Image Processing Issues

**Problem**: Image upload fails
```
Check:
1. File size < 10MB
2. Format is JPEG or PNG
3. Permissions on media directory
4. Disk space available
```

## Network Issues

### Services Can't Communicate

**Problem**: Frontend can't reach backend
```bash
# Check network
docker network ls
docker network inspect healio-network

# Verify all services are on same network
docker-compose ps
```

**Problem**: 502 Bad Gateway from Nginx
```
Solutions:
1. Check backend is running: docker-compose ps
2. Check nginx logs: docker-compose logs nginx
3. Restart nginx: docker-compose restart nginx
```

## Performance Issues

### Slow Response Times

**Problem**: API responses are slow
```
Solutions:
1. Enable Redis caching (already configured)
2. Check database indexes
3. Optimize Docker resource allocation
4. Use production builds (npm run build)
```

**Problem**: Image analysis takes too long
```
This is normal for ML processing (2-5 seconds)
- Mock models are intentionally fast
- Real models would be optimized with GPU
```

## Development Issues

### Hot Reload Not Working

**Problem**: Frontend changes don't reflect
```bash
# Restart development server
docker-compose restart frontend

# Or run locally
cd frontend && npm start
```

**Problem**: Backend changes don't apply
```bash
# Clear cache
docker-compose exec api php artisan cache:clear
docker-compose exec api php artisan config:clear
docker-compose exec api php artisan route:clear
```

## Common Error Messages

### "SQLSTATE[HY000] [2002] Connection refused"
- Database not ready yet, wait 30 seconds
- Check DB_HOST in .env (should be 'db' for Docker)

### "Cross-Origin Request Blocked"
- Check CORS settings in Laravel
- Verify frontend API URL in .env

### "Module not found: Can't resolve"
- Missing npm package, run npm install
- Check import paths are correct

### "Class 'App\Http\Controllers\...' not found"
- Run composer dump-autoload
- Check namespace declarations

## Getting Help

If you encounter issues not listed here:

1. **Check Logs**
   ```bash
   # All services
   docker-compose logs

   # Specific service
   docker-compose logs [frontend|api|ai-service|db]

   # Follow logs
   docker-compose logs -f
   ```

2. **Check Service Status**
   ```bash
   docker-compose ps
   docker-compose exec api php artisan --version
   ```

3. **Clean Restart**
   ```bash
   docker-compose down -v
   docker-compose up --build -d
   ```

4. **Check GitHub Issues**
   - Search existing issues
   - Create new issue with logs

5. **Verify Requirements**
   - Docker version 20.10+
   - Docker Compose version 2.0+
   - 4GB+ RAM available
   - 10GB+ disk space

## Reset Everything

If all else fails, nuclear option:

```bash
# Warning: This deletes all data and containers
docker-compose down -v
docker system prune -a
rm -rf frontend/node_modules backend-api/vendor

# Start fresh
./setup.sh
```

## Still Need Help?

Open an issue on GitHub with:
- Error message
- Steps to reproduce
- Docker version
- Operating system
- Relevant logs

We're here to help! 🚀
