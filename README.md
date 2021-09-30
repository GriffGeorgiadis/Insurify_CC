# Insurify-CC

Created a departure board for North Station using MTBA API for Insurify's coding challenge
 


## Deployment

To deploy this project run

```bash
  git clone https://github.com/GriffGeorgiadis/Insurify_CC.git
```
```bash
  cd my-app
```
```bash
  npm install
```
```bash
  npm run start
```

  
## API Reference

#### Get predictions

```http
  GET https://api-v3.mbta.com/predictions?filter[route_type]=2&include=schedule,stop,trip&filter[stop]=place-north
```
