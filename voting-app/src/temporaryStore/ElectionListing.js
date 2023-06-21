import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import {CardActions, CardContent, CardMedia} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as React from "react";

//this is a test

const ElectionListing = ({pastData}) => {

    return (
        <Container>
            <Grid container spacing={4}>
                {pastData.map((data) => (
                    <Grid item key={data} xs={12} sm={6} md={4}>
                        <Card
                            sx={{height: '100%', display: 'flex', flexDirection: 'column'}}
                        >
                            <CardMedia
                                component="div"
                                sx={{
                                    // 16:9
                                    pt: '56.25%',
                                }}
                                image={data.imageUrl}
                            />
                            <CardContent sx={{flexGrow: 1}}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {data.heading}
                                </Typography>
                                <Typography>
                                    {data.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">View</Button>
                                <Button size="small">Edit</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
};

export default ElectionListing;